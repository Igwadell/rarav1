import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Logo = () => (
    <div className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.6641 12.3125L11.75 4.04688L3.03125 9.40625L12.6641 12.3125Z" fill="#76D97E"/>
          <path d="M28.9688 9.40625L20.25 4.04688L19.3359 12.3125L28.9688 9.40625Z" fill="#76D97E"/>
          <path d="M29.3359 10.8281L19.3359 13.7188V28.3516L29.3359 23.1016V10.8281Z" fill="#2F9A48"/>
          <path d="M3 10.8281V23.1016L12.6641 28.3516V13.7188L3 10.8281Z" fill="#42C359"/>
          <path d="M12.6641 13.7188L19.3359 13.7188V28.3516L16 30.1406L12.6641 28.3516V13.7188Z" fill="#36B34B"/>
      </svg>
      <span className="text-xl font-bold font-headline text-primary">Rara.com</span>
    </div>
  );

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 mb-6 md:mb-0">
            <Logo />
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">Safety information</Link></li>
              <li><Link href="#" className="hover:text-primary">Cancellation options</Link></li>
              <li><Link href="#" className="hover:text-primary">Report a concern</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Rara.com</Link></li>
              <li><Link href="#" className="hover:text-primary">Support refugees</Link></li>
              <li><Link href="#" className="hover:text-primary">Combating discrimination</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Hosting</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/create-listing" className="hover:text-primary">Host your home</Link></li>
              <li><Link href="#" className="hover:text-primary">Hosting resources</Link></li>
              <li><Link href="#" className="hover:text-primary">Community forum</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Investors</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {year} Rara.com, Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
