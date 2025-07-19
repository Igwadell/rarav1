
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Menu, CircleUserRound, Search, Filter, TrendingUp, Tent, Building, Home, Mountain } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.6641 12.3125L11.75 4.04688L3.03125 9.40625L12.6641 12.3125Z" fill="#76D97E"/>
          <path d="M28.9688 9.40625L20.25 4.04688L19.3359 12.3125L28.9688 9.40625Z" fill="#76D97E"/>
          <path d="M29.3359 10.8281L19.3359 13.7188V28.3516L29.3359 23.1016V10.8281Z" fill="#2F9A48"/>
          <path d="M3 10.8281V23.1016L12.6641 28.3516V13.7188L3 10.8281Z" fill="#42C359"/>
          <path d="M12.6641 13.7188L19.3359 13.7188V28.3516L16 30.1406L12.6641 28.3516V13.7188Z" fill="#36B34B"/>
      </svg>
    <span className="text-xl font-bold font-headline text-primary hidden md:block">Rara.com</span>
  </Link>
);

const topNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/listings', label: 'Properties' },
  { href: '#', label: 'How It Works' },
  { href: '#', label: 'About Us' },
];

const categoryFilters = [
    { label: "Amazing views", icon: Mountain, search: 'view' },
    { label: "Farms", icon: Home, search: 'farm' },
    { label: "Camping", icon: Tent, search: 'camping' },
    { label: "Cabins", icon: Building, search: 'cabin' },
    { label: "Mansions", icon: Building, search: 'mansion' },
    { label: "Trending", icon: TrendingUp, search: 'trending' },
];

const searchFormSchema = z.object({
  search: z.string(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any | null>(null); // Changed type to any as firebase/auth is removed

  useEffect(() => {
    // Removed firebase/auth listeners
  }, []);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: '',
    },
  });

  const onSearchSubmit = (values: SearchFormValues) => {
    router.push(`/listings?search=${encodeURIComponent(values.search)}`);
  };

  const handleCategoryClick = (search: string) => {
    router.push(`/listings?search=${encodeURIComponent(search)}`);
  };

  const handleLogout = async () => {
    try {
      // Removed firebase/auth signOut
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout Error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was an error logging out. Please try again.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
           <nav className="hidden lg:flex items-center gap-4">
            {topNavLinks.map(link => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <CircleUserRound className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href="/dashboard/user">My Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/host">Host Dashboard</Link></DropdownMenuItem>
                         <DropdownMenuItem asChild><Link href="/dashboard/admin">Admin Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
            ) : (
                <>
                <Button variant="ghost" asChild>
                    <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
                </>
            )}
             <div className="lg:hidden">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         {topNavLinks.map(link => (
                            <DropdownMenuItem key={link.label} asChild>
                                <Link href={link.href}>{link.label}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                 </DropdownMenu>
             </div>
        </div>
      </div>
      <div className="container hidden md:flex h-16 items-center justify-between border-t">
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSearchSubmit)}>
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search destinations" className="pl-10 w-full max-w-sm" {...field} />
                         </div>
                      </FormItem>
                    )}
                  />
              </form>
            </Form>
          </div>
          <div className="flex items-center gap-4">
              {categoryFilters.map(filter => (
                 <Button key={filter.label} variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-primary" onClick={() => handleCategoryClick(filter.search)}>
                    <filter.icon className="h-6 w-6" />
                    <span className="text-xs">{filter.label}</span>
                 </Button>
              ))}
          </div>
          <div className="flex items-center gap-2 pl-4">
             <Button variant="outline" onClick={() => router.push('/listings')}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
            </Button>
          </div>
      </div>
    </header>
  );
}
