import { products } from '@/lib/data'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container max-w-screen-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Welcome to Balaji Mart</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Balaji MartMan. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
