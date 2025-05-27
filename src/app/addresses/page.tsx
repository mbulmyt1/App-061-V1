import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ReturnButton } from '@/components/return-button';
import { getAddresses } from '@/actions/address.actions';
import AddressTableInteractive from '@/components/admin/address-table-interactive'; // Import the new component

export default async function AdminAddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/auth/login');
  }

  // if (session.user.role !== 'ADMIN') {
  //   return (
  //     <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
  //       <h1 className="text-2xl font-semibold">Forbidden</h1>
  //       <p className="text-red-500">
  //         You do not have permission to access this page.
  //       </p>
  //       <ReturnButton href="/admin/dashboard" label="Admin Dashboard" />
  //     </div>
  //   );
  // }

  // Fetch initial data on the server
  const { data: initialAddresses, total: initialTotal, error: initialError } = await getAddresses({ page: 1, pageSize: 10 });

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <ReturnButton href="/admin/dashboard" label="Admin Dashboard" />
      {/* 
        The H1 title and "Add New Address" button are now inside AddressTableInteractive.
        We pass the initial data to the client component.
      */}
      <AddressTableInteractive
        initialAddresses={initialAddresses || []}
        initialTotal={initialTotal || 0}
        initialError={initialError}
      />
    </div>
  );
}
