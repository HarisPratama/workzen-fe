"use client"

function App({
                 children,
             }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
            {/* Main Content */}
            <main className="bg-gray-50">
                {children}
            </main>
        </div>
    );
}

export default App;
