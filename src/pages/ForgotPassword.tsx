import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, KeyRound } from "lucide-react";
import {
  requestPasswordReset,
  resendOtp,
  verifyResetOtp,
  resetPassword,
} from "@/services/auth/authApi";

const bosqLogo = "/bosq-logo-light.png";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await requestPasswordReset(email);
      setMessage(
        response.message ||
          "If your email is registered, you will receive a password reset code",
      );
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Verify OTP by attempting to reset with a dummy password
      // We'll use the actual API call but only to verify the OTP
      // In a real scenario, you might want a separate endpoint for just OTP verification
      
      const response = await verifyResetOtp(email, otp);
      setMessage(response.message || "OTP verified successfully");
      setStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };
const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  setMessage("");

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    setIsLoading(false);
    return;
  }

  try {
    const response = await resetPassword(
      email,
      newPassword,
      confirmPassword
    );

    setMessage(response.message || "Password reset successful");
    setStep("success");

    setTimeout(() => setRedirectToLogin(true), 2000);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to reset password");
  } finally {
    setIsLoading(false);
  }
};

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await resendOtp(email);
      setMessage(response.message || "A new code has been sent to your email");
      setOtp(""); // Clear the OTP field
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password";
      case "otp":
        return "Verify Code";
      case "password":
        return "Reset Password";
      case "success":
        return "Password Reset";
      default:
        return "Forgot Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email to receive a password reset code";
      case "otp":
        return "Enter the 6-digit code sent to your email";
      case "password":
        return "Enter your new password";
      case "success":
        return "Your password has been reset successfully";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <img src={bosqLogo} alt="BOSQ" className="mx-auto h-12 w-auto mb-6" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Password Recovery
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-healthcare-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && !error && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification Only */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="pl-10 text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Code sent to {email}
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("otp")}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Verification
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground">Redirecting to login...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>&copy; 2024 BOSQ. All rights reserved.</p>
          <p className="mt-1">Content Management System</p>
        </div>
      </div>
    </div>
  );
}
