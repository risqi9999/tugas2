<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
//use Illuminate\Http\Response; 
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ChirpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     public function index(): Response
    {
        
        return Inertia::render('Chirps/Index', [
		//
		'chirps' => Chirp::with('user:id,name')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        //
        $validated = $request->validate([
                'message' => 'required|string|max:255',
                'media' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,avi|max:10240', // Maksimal 10 MB
                'hashtags' => 'nullable|string|regex:/^(#\w+)(,\s*#\w+)*$/|max:255',
        ]);

        // Simpan file media jika ada
        $mediaPath = null;
        if ($request->hasFile('media')) {
                $mediaPath = $request->file('media')->store('uploads/media', 'public');
        }

        // Tambahkan path media dan hashtag ke data yang akan disimpan
        $validated['media_path'] = $mediaPath;
        $validated['hashtags'] = $request->input('hashtags');

        $request->user()->chirps()->create($validated);

        return redirect(route('chirps.index'));

    }

    /**
     * Display the specified resource.
     */
    public function show(Chirp $chirp)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chirp $chirp)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chirp $chirp): RedirectResponse
    {
        //
        Gate::authorize('update', $chirp);
 
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);
 
        $chirp->update($validated);
 
        return redirect(route('chirps.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chirp $chirp): RedirectResponse
    {
        //
        Gate::authorize('delete', $chirp);
 
        $chirp->delete();
 
        return redirect(route('chirps.index'));
    }
}
