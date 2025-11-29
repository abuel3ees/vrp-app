<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ]
        ]);
    }

    /**
     * Show form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('admin/Users/Create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:8'],

        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')
                         ->with('success', 'User created successfully.');
    }

    /**
     * Display a single user (show page).
     */
    public function show(User $user)
    {
        return Inertia::render('admin/Users/Show', [
            'user' => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'created_at' => $user->created_at->toDateTimeString(),
            ]
        ]);
    }

    /**
     * Show the form for editing an existing user.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/Users/Edit', [
            'user' => [
                'id'    => $user->id,
                'first_name'  => $user->first_name,
                'last_name'  => $user->last_name,
                
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Update the user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'password' => $validated['password']
                            ? Hash::make($validated['password'])
                            : $user->password,
        ]);

        return redirect()->route('users.index')
                         ->with('success', 'User updated successfully.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')
                         ->with('success', 'User deleted successfully.');
    }
}