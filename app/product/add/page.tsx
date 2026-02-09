'use client';

import { useState } from 'react';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get("name"),
            description: formData.get("description"),
            productCode: formData.get("productCode"),
            images: (formData.get("images") as string)
                .split(",")
                .map((img) => img.trim()),
        }


        try {
            const res = await fetch('/api/products/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage('✅ Product added successfully');
            e.currentTarget.reset();
        } catch (err: any) {
            setMessage(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Add New Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Product Name *
                    </label>
                    <input
                        name="name"
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Handcrafted Coffee Mug"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Tell the story of your product..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Product Code *
                    </label>
                    <input
                        name="productCode"
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="BC-MUG-001"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Image URLs (comma separated)
                    </label>
                    <input
                        name="images"
                        className="w-full border rounded px-3 py-2"
                        placeholder="https://..., https://..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Product'}
                </button>

                {message && (
                    <p className="text-sm mt-2">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
