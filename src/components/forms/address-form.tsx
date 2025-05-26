'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Address } from '@/generated/prisma';
import { addressSchema } from '@/lib/validators/address';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { salutationOptions, countryOptions } from '@/lib/form-options';

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export default function AddressForm({
  address,
  onSubmit,
  isSubmitting,
  onCancel,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      salutation: address?.salutation || '',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      street: address?.street || '',
      houseNumber: address?.houseNumber || '',
      postalCode: address?.postalCode || '',
      city: address?.city || '',
      country: address?.country || '',
      email: address?.email || '',
      phone: address?.phone || '',
      mobile: address?.mobile || '',
      keywords: address?.keywords || '',
      searchTerms: address?.searchTerms || '',
      profileImage: address?.profileImage || '',
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        salutation: address.salutation || '',
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        company: address.company || '',
        street: address.street || '',
        houseNumber: address.houseNumber || '',
        postalCode: address.postalCode || '',
        city: address.city || '',
        country: address.country || '',
        email: address.email || '',
        phone: address.phone || '',
        mobile: address.mobile || '',
        keywords: address.keywords || '',
        searchTerms: address.searchTerms || '',
        profileImage: address.profileImage || '',
      });
    } else {
      // Reset to default empty values if no address is provided (e.g., for a new form after editing)
      form.reset({
        salutation: '',
        firstName: '',
        lastName: '',
        company: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        country: '',
        email: '',
        phone: '',
        mobile: '',
        keywords: '',
        searchTerms: '',
        profileImage: '',
      });
    }
  }, [address, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salutation */}
          <FormField
            control={form.control}
            name="salutation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salutation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a salutation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {salutationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street *</FormLabel>
                <FormControl>
                  <Input placeholder="Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* House Number */}
          <FormField
            control={form.control}
            name="houseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House Number *</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile */}
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 987 654 321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Keywords */}
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Textarea placeholder="Tags, categories, etc." {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated keywords for easy searching.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Search Terms */}
        <FormField
          control={form.control}
          name="searchTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Terms</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional terms for search..." {...field} />
              </FormControl>
              <FormDescription>
                Additional search terms.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Image URL */}
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>
                URL of the profile image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
