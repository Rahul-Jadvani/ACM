'use client';
import React, { useState, FormEvent } from 'react';
import {
  FaGoogle,
  FaDiscord,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/http/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: loginUserMutate, isPending: isLoginUserMutatePending } =
    useMutation({
      mutationKey: ['loginUser'],
      mutationFn: async (data: any) => await loginUser(data),
      onSuccess: (data: any) => {
        toast.success(data.message);
        router.push('/'); // Default redirect
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || error?.message);
      },
    });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleEmailLogin = () => {
    setShowEmailLogin((prev) => !prev);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    loginType: string
  ) => {
    event.preventDefault();
    switch (loginType) {
      case 'google':
        signIn('google', { redirectTo: '/' });
        break;
      case 'discord':
        signIn('discord', { redirectTo: '/' });
        break;
      case 'email':
        loginUserMutate({ email, password });
        break;
      case 'marketplace':
        signIn('credentials', { redirectTo: '/authpage' }); // Marketplace login
        break;
      default:
        console.error('Unknown login type');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#14021D] to-[#3C0056] p-4">
      <div className="rounded-[40px] border-1 border-[#D700E1] shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl sm:text-[42px] font-medium mb-6 text-center">
          Login
        </h1>
        <form
          onSubmit={(e) => handleSubmit(e, showEmailLogin ? 'email' : 'social')}
          className="space-y-4 p-0 sm:p-5"
        >
          {/* Google Login */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'google')}
            className="w-full py-2 text-xl font-semibold bg-white text-black rounded-xl flex items-center justify-center mb-6"
          >
            Login with Google <FcGoogle className="ml-2 w-7 h-7" />
          </button>

          {/* Discord Login */}
          <Link href="https://discord.com/oauth2/authorize?client_id=1221868348015644804&response_type=code&redirect_uri=https%3A%2F%2Fwww.captainside.com%2Fapi%2Fdiscord%2Fredirect&scope=identify+email">
            <button
              type="button"
              className="w-full py-2 text-xl font-semibold bg-[#5865F2] text-white rounded-xl flex items-center justify-center"
            >
              Login with Discord <FaDiscord className="ml-2 w-7 h-7" />
            </button>
          </Link>

          {/* Separator */}
          <div className="space-y-4">
            <p className="text-center text-xl">or</p>
          </div>

          {/* Marketplace Login */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'marketplace')}
            className="w-full py-2 text-xl font-semibold bg-[#9B006F] text-white rounded-xl flex items-center justify-center"
          >
            Login for Marketplace
          </button>

          {/* Email Login */}
          <button
            type="button"
            className="w-full py-2 text-xl font-semibold bg-[#350949] text-white rounded-xl flex items-center justify-center"
            onClick={toggleEmailLogin}
          >
            Login with Email
          </button>

          {showEmailLogin && (
            <div className="space-y-4 mt-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-5 bg-[#350949] rounded-lg focus:outline-none"
                  required
                />
                <FaEnvelope className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-5 bg-[#350949] rounded-lg focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col gap-4 justify-center">
            <button
              type="submit"
              className="px-14 py-3 text-sm font-bold bg-[#D700E1] text-white rounded-3xl"
            >
              {isLoginUserMutatePending ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2Icon
                    strokeWidth={4}
                    className="w-4 h-4 animate-spin"
                  />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
            <Link href="/signup" className="text-sm text-center">
              Don&apos;t have an account?{' '}
              <span className="text-[#D700E1] hover:underline">Sign up</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
