import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
    title: 'Mini Facebook',
    description: 'Social Media Plattform',
};

export default async function RootLayout({
                                             children,
                                             params: { locale },
                                         }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}