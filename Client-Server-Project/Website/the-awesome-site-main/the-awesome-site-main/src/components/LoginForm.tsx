"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";
import styles from "./LoginForm.module.scss";

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (formDataObj: FormData) => {
        setError(null);
        setFieldErrors({});

        startTransition(async () => {
            try {
                await loginAction(formDataObj);
            } catch (err) {
                const message = (err as Error).message;
                if (message.toLowerCase().includes("username")) {
                    setFieldErrors({ username: message });
                } else if (message.toLowerCase().includes("password")) {
                    setFieldErrors({ password: message });
                } else {
                    setError(message);
                }
            }
        });
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>
                        Login to your account to continue
                    </p>
                </div>

                <form action={handleSubmit} className={styles.form}>
                    {/* Username Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>👤</span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="Enter your username"
                                className={`${styles.input} ${fieldErrors.username ? styles.error : ""}`}
                                disabled={isPending}
                                autoComplete="username"
                            />
                        </div>
                        {fieldErrors.username && (
                            <div className={styles.fieldError}>
                                {fieldErrors.username}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.passwordWrapper}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your password"
                                    className={`${styles.input} ${fieldErrors.password ? styles.error : ""}`}
                                    disabled={isPending}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>
                        {fieldErrors.password && (
                            <div className={styles.fieldError}>
                                {fieldErrors.password}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className={styles.registerLink}>
                    Don't have an account?{" "}
                    <Link href="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
}
