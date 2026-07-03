import { notFound } from 'next/navigation';
import { menuItems } from '@/data/menuItems';
import ItemDetailScreen from '@/screens/ItemDetailScreen';

// Pre-generate all item pages at build time
export function generateStaticParams() {
  return menuItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = menuItems.find((i) => i.id === id);
  if (!item) return {};
  return {
    title: `${item.name} — Brûlé Café`,
    description: item.description,
    openGraph: {
      title: `${item.name} — Brûlé Café`,
      description: item.description,
      images: [item.thumbnail],
    },
  };
}

export default async function ItemPage({ params }) {
  const { id } = await params;
  const item = menuItems.find((i) => i.id === id);
  if (!item) notFound();
  return <ItemDetailScreen item={item} />;
}
