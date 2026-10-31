// Rota raiz — redireciona baseado na sessão
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function RootPage() {
  const session = await getSession();
  
  if ((session as any).isAuthenticated) {
    redirect('/inicio');
  } else {
    redirect('/acesso');
  }
}
