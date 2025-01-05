/*import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';

export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        media: null,
        hashtags: '',
    });

    // Handle perubahan file (gambar atau video)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) { // 10MB
                alert("File size exceeds 10MB limit.");
                return;
        }
        //if (file) {
            setData('media', file);
        //}
    };

    // Handle perubahan pada textarea message
    const handleMessageChange = (e) => {
        const message = e.target.value;
        setData('message', message);

        // Ekstraksi hashtag dari message menggunakan regex
        const extractedHashtags = message.match(/#\w+/g);
setData('hashtags', extractedHashtags ? extractedHashtags.join(', ') : '');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('chirps.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={handleMessageChange}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />

                    
                    <div className="mt-4">
                        <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                            Upload an image or video (optional)
                        </label>
                        <input
                            type="file"
			    id="media"
                            name="media"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="mt-2"
                        />
                        <InputError message={errors.media} className="mt-2" />
                    </div>

                    
                    {data.hashtags && (
                        <div className="mt-4 text-sm text-gray-500">
                            <strong>Detected Hashtags:</strong> {data.hashtags}
                        </div>
                    )}

                    
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>

                
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map((chirp) => (
                        <Chirp key={chirp.id} chirp={chirp} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
*/

import React, { useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        media: null,
        hashtags: '',
    });

    const quillRef = useRef(null);

    // Initialize Quill editor
    useEffect(() => {
        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            placeholder: "What's on your mind?",
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                ],
            },
        });

        // Update message in the form when Quill content changes
        quill.on('text-change', () => {
            const message = quill.root.innerHTML;
            setData('message', message);

            // Extract hashtags from the text
            const extractedHashtags = message.match(/#\w+/g);
            setData('hashtags', extractedHashtags ? extractedHashtags.join(', ') : '');
        });
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) { // 10MB
            alert("File size exceeds 10MB limit.");
            return;
        }
        setData('media', file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('chirps.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    {/* Quill Editor */}
                    <div className="quill-editor" ref={quillRef}></div>
                    <InputError message={errors.message} className="mt-2" />

                    {/* Input untuk gambar atau video */}
                    <div className="mt-4">
                        <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                            Upload an image or video (optional)
                        </label>
                        <input
                            type="file"
                            id="media"
                            name="media"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="mt-2"
                        />
                        <InputError message={errors.media} className="mt-2" />
                    </div>

                    {/* Menampilkan hasil hashtag yang terdeteksi */}
                    {data.hashtags && (
                        <div className="mt-4 text-sm text-gray-500">
                            <strong>Detected Hashtags:</strong> {data.hashtags}
                        </div>
                    )}

                    {/* Tombol Submit */}
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>

                {/* Daftar Chirps */}
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map((chirp) => (
                        <Chirp key={chirp.id} chirp={chirp} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}




