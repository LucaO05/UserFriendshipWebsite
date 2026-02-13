import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mini Facebook",
    description: "Social Media Plattform",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
        <body className="antialiased">{children}</body>
        </html>
    );
}