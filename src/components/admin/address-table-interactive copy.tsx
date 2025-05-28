'use client';

import { useState, useEffect } from 'react';
import type { Address } from '@/generated/prisma';
import { z } from 'zod';
import { addressSchema } from '@/lib/validators/address';
import { createAddress, updateAddress } from '@/actions/address.actions';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAddresses, deleteAddress } from '@/actions/address.actions';
import { toast } from 'sonner';
import { Trash2, Pencil, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddressForm from '@/components/forms/address-form';

function escapeCsvValue(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

interface AddressTableInteractiveProps {
  initialAddresses: Address[];
  initialTotal: number;
  initialError?: string | null;
}

export default function AddressTableInteractive({
  initialAddresses,
  initialTotal,
  initialError = null,
}: AddressTableInteractiveProps) {
  const PAGE_SIZE = 6;
  const [searchQuery, setSearchQuery] = useState('');
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [total, setTotal] = useState<number>(initialTotal);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false); // For table data loading
  const [currentPage, setCurrentPage] = useState(1);

  // State for the modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);


  const handleSearch = async (page = 1) => {
    setIsLoading(true); // For table data loading
    setError(null);
    try {
      const result = await getAddresses({ searchQuery, page, pageSize: PAGE_SIZE });
      if (result.error) {
        toast.error(`Failed to fetch addresses: ${result.error}`);
        setError(result.error);
        // setAddresses([]); // Keep stale data on error? Or clear?
        // setTotal(0);
      } else {
        setAddresses(result.data || []);
        setTotal(result.total || 0);
        setCurrentPage(page);
        if (!result.data || result.data.length === 0 && searchQuery.trim() !== '') {
          toast.info('No addresses found matching your criteria.');
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      toast.error(`Failed to fetch addresses: ${errorMessage}`);
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof addressSchema>) => {
    setIsSubmittingForm(true);
    try {
      let result;
      const formData = new FormData();
      // Convert values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });


      if (editingAddress) {
        result = await updateAddress(editingAddress.id, formData);
        if (result.data && !result.error) {
          toast.success('Address updated successfully!');
        } else {
          // Handle field errors specifically if they exist
          if (result.fieldErrors) {
            let errorMsg = "Validation failed: ";
            for (const key in result.fieldErrors) {
              // @ts-ignore
              errorMsg += `${key}: ${result.fieldErrors[key].join(', ')}. `;
            }
            toast.error(errorMsg.trim());
          } else {
            toast.error(result.error || 'Failed to update address.');
          }
          setIsSubmittingForm(false); // Important: set submitting to false before returning
          return;
        }
      } else {
        result = await createAddress(formData);
        if (result.data && !result.error) {
          toast.success('Address created successfully!');
        } else {
           if (result.fieldErrors) {
            let errorMsg = "Validation failed: ";
            for (const key in result.fieldErrors) {
              // @ts-ignore
              errorMsg += `${key}: ${result.fieldErrors[key].join(', ')}. `;
            }
            toast.error(errorMsg.trim());
          } else {
            toast.error(result.error || 'Failed to create address.');
          }
          setIsSubmittingForm(false); // Important: set submitting to false before returning
          return;
        }
      }
      setIsModalOpen(false);
      setEditingAddress(null);
      await handleSearch(currentPage); // Refresh table, try to stay on current page
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during form submission.';
      toast.error(errorMessage);
    }
    setIsSubmittingForm(false);
  };

  // Effect to handle initial error display
  // And to trigger initial search if no initial addresses and no error
  useEffect(() => {
    if (initialError) {
      toast.error(`Error loading initial addresses: ${initialError}`);
    } else if (initialAddresses.length === 0 && initialTotal === 0 && !initialError) {
      // This case implies the server component might not have passed initial data
      // or it was truly empty. Let's perform an initial fetch.
      // handleSearch(1); // Removed to avoid double fetch on initial load with data
    }
  }, [initialError, initialAddresses.length, initialTotal]); // Removed handleSearch from dependencies

  // Effect to handle initial error display
  useEffect(() => {
    if (initialError) {
      toast.error(`Error loading initial addresses: ${initialError}`);
    }
  }, [initialError]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold">Address Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                setIsLoading(true);
                const allResults = await getAddresses({
                  searchQuery,
                  page: 1,
                  pageSize: total || 1000
                });

                if (allResults.error) {
                  throw new Error(allResults.error);
                }

                const addresses = allResults.data || [];

                const headers = [
                  'Salutation',
                  'First Name',
                  'Last Name',
                  'Company',
                  'Street',
                  'House Number',
                  'City',
                  'Postal Code',
                  'Country',
                  'Email',
                  'Phone',
                  'Mobile'
                ];

                const csvContent = [
                  headers.join(','),
                  ...addresses.map(addr => [
                    escapeCsvValue(addr.salutation),
                    escapeCsvValue(addr.firstName),
                    escapeCsvValue(addr.lastName),
                    escapeCsvValue(addr.company),
                    escapeCsvValue(addr.street),
                    escapeCsvValue(addr.houseNumber),
                    escapeCsvValue(addr.city),
                    escapeCsvValue(addr.postalCode),
                    escapeCsvValue(addr.country),
                    escapeCsvValue(addr.email),
                    escapeCsvValue(addr.phone),
                    escapeCsvValue(addr.mobile)
                  ].join(','))
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const date = new Date().toISOString().split('T')[0];
                link.href = URL.createObjectURL(blob);
                link.download = `addresses_${date}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
                toast.success('CSV export completed successfully');
              } catch (error) {
                toast.error('Failed to export addresses: ' + (error instanceof Error ? error.message : 'Unknown error'));
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading || total === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
          >
            Add New Address
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => handleSearch(1)} disabled={isLoading}> {/* Search always goes to page 1 */}
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && !isLoading && (
        <p className="text-red-500 py-4">Error: {error}</p>
      )}

      {isLoading && <p className="py-4">Loading addresses...</p>}

      {!isLoading && !error && addresses.length === 0 && (
        <p className="py-4">No addresses found.</p>
      )}

      {!isLoading && !error && addresses.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Street</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell>
                  {address.salutation ? `${address.salutation} ` : ''}
                  {`${address.firstName} ${address.lastName}`}
                </TableCell>
                <TableCell>{address.company}</TableCell>
                <TableCell>{`${address.street} ${address.houseNumber}`}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.postalCode}</TableCell>
                <TableCell>{address.country}</TableCell>
                <TableCell>{address.email}</TableCell>
                <TableCell>{address.phone || address.mobile}</TableCell>
                <TableCell className="space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingAddress(address);
                      setIsModalOpen(true);
                    }}
                    disabled={isLoading || isSubmittingForm}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isLoading || isSubmittingForm}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          address.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading || isSubmittingForm}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            setIsLoading(true); // Use table loading state for delete operation
                            try {
                              const result = await deleteAddress(address.id);
                              if (result.success) {
                                toast.success('Address deleted successfully.');
                                // Refresh table, try to stay on current page or go to previous if current page becomes empty
                                const newTotal = total -1;
                                const newMaxPage = Math.ceil(newTotal / PAGE_SIZE);
                                if (currentPage > newMaxPage && newMaxPage > 0) {
                                   await handleSearch(newMaxPage);
                                } else if (newTotal === 0) {
                                   await handleSearch(1); // Go to page 1 if all items deleted
                                }
                                else {
                                   await handleSearch(currentPage);
                                }
                              } else {
                                toast.error(result.error || 'Failed to delete address.');
                              }
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : 'An unknown error occurred.');
                            }
                            setIsLoading(false);
                          }}
                          disabled={isLoading || isSubmittingForm}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-between items-center pt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.max(1, Math.ceil(total / PAGE_SIZE))} (Total: {total} addresses)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSearch(currentPage - 1)}
            disabled={isLoading || currentPage <= 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => handleSearch(currentPage + 1)}
            disabled={isLoading || currentPage * PAGE_SIZE >= total}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
        if (isSubmittingForm) return; // Prevent closing while submitting
        setIsModalOpen(isOpen);
        if (!isOpen) {
          setEditingAddress(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmittingForm}
            onCancel={() => {
              if (isSubmittingForm) return;
              setIsModalOpen(false);
              setEditingAddress(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
