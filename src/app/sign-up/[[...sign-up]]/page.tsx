// "use client";
// import * as React from "react";
// import { useSignUp, useSignIn, SignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { Progress } from "@/components/ui/progress";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";

// export default function SignUpPage() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const { signIn } = useSignIn();
//   const [verifying, setVerifying] = React.useState(false);
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [code, setCode] = React.useState("");
//   const [error, setError] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [passwordStrength, setPasswordStrength] = React.useState(0);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const router = useRouter();

//   const checkPasswordStrength = (password: string) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 25;
//     if (password.match(/[a-z]+/)) strength += 25;
//     if (password.match(/[A-Z]+/)) strength += 25;
//     if (password.match(/[0-9]+/)) strength += 25;
//     setPasswordStrength(strength);
//   };

//   React.useEffect(() => {
//     checkPasswordStrength(password);
//   }, [password]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!isLoaded) return;
//     setIsLoading(true);
//     setError("");

//     try {
//       await signUp.create({
//         emailAddress: email,
//         password,
//       });

//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

//       setVerifying(true);
//     } catch (err: any) {
//       console.error("Error:", err);
//       if (
//         err.errors?.[0]?.message.includes("been found in an online data breach")
//       ) {
//         setError(
//           "This password is unsafe. Please choose a stronger, unique password."
//         );
//       } else {
//         setError(
//           err.errors?.[0]?.message || "Failed to sign up. Please try again."
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleVerification(e: React.FormEvent) {
//     e.preventDefault();
//     if (!isLoaded) return;
//     setIsLoading(true);
//     setError("");

//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code,
//       });

//       if (completeSignUp.status !== "complete") {
//         console.log(JSON.stringify(completeSignUp, null, 2));
//         throw new Error("Failed to verify email. Please try again.");
//       }

//       if (completeSignUp.status === "complete") {
//         await setActive({ session: completeSignUp.createdSessionId });
//         router.push("/");
//       }
//     } catch (err: any) {
//       console.error("Error:", err);
//       setError(
//         err.errors?.[0]?.message || "Failed to verify email. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleSignIn() {
//     try {
//       if (signIn) {
//         await signIn.create({
//           identifier: email,
//           password,
//         });
//         router.push("/");
//       } else {
//         setError("Failed to sign in. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error:", err);
//       setError(
//         err.errors?.[0]?.message || "Failed to sign in. Please try again."
//       );
//     }
//   }
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>{verifying ? "Verify Email" : "Sign Up"}</CardTitle>
//           <CardDescription>
//             {verifying
//               ? "Enter the verification code sent to your email"
//               : "Create a new account"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : verifying ? (
//             <form onSubmit={handleVerification} className="space-y-4">
//               <Input
//                 value={code}
//                 placeholder="Verification code"
//                 onChange={(e) => setCode(e.target.value)}
//                 className="w-full"
//                 required
//               />
//               <Button type="submit" className="w-full">
//                 Verify Email
//               </Button>
//             </form>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Input
//                 type="email"
//                 value={email}
//                 placeholder="Email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full"
//                 required
//               />
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   placeholder="Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full"
//                   required
//                   minLength={8}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 <Progress value={passwordStrength} className="mt-2" />
//                 <p className="text-sm mt-1">
//                   Password strength: {passwordStrength}%
//                 </p>
//               </div>
//               <Button type="submit" className="w-full">
//                 Sign Up
//               </Button>
//               <Button variant="secondary" className="w-full">
//                 <Link
//                   href="/sign-in"
//                   className="text-sm text-gray-500 hover:text-gray-800"
//                 >
//                   Already have an account? Sign in
//                 </Link>
//               </Button>
//             </form>
//           )}

//           {!verifying && (
//             <div className="mt-6 p-4 rounded-md text-sm">
//               <h4 className="font-semibold mb-2">Password Guidelines:</h4>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Use at least 12 characters, more is better</li>
//                 <li>Include a mix of uppercase and lowercase letters</li>
//                 <li>Use numbers and special characters</li>
//                 <li>Avoid personal information or common words</li>
//                 <li>Create a unique password you have not used elsewhere</li>
//                 <li>Consider using a passphrase (a string of random words)</li>
//               </ul>
//             </div>
//           )}
//         </CardContent>
//         <CardFooter className="text-sm text-gray-500 text-center">
//           By signing up, you agree to our Terms of Service and Privacy Policy.
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
