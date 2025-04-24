import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore";
import { useLogin } from "@controllers/auth/useLogin/index";
import { useRegister } from "@controllers/auth/useRegister/index";
import { Input, ErrorContainer, Dropdown, Toggle, Button } from "@components/index";
import { OtpModal } from "./components/index";
import styles from "./authentication.module.scss";

import { AuthenticationType, AuthenticationProps } from "./authentication.d";
import { PurchaseProductModal } from "@components/Modals";

export default function Authentication({ type }: AuthenticationProps) {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();

    const { login } = useLogin();
    const { register } = useRegister();

    if (user) return <Navigate to="/dashboard" />;

    const submitForm = async () => {
        if (username === "") return setError("Where's the username?");
        if (password === "") return setError("Where's the password?");

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) return setError("Username can only contain letters, numbers, underscores, and dashes.");

        if (type === AuthenticationType.LOGIN) {
            setLoading("Logging in");
            login(username, password)
                .then(() => navigate("/dashboard"))
                .catch((err) => {
                    if (err.status === 401) return createModal(<OtpModal username={username} password={password} />);

                    if (err?.data?.message) setError(err.data.message);
                    else setError("Something went wrong.");
                })
                .finally(() => setLoading(false));
        } else if (type === AuthenticationType.REGISTER) {
            if (!checked) return setError("You must agree to our Privacy Policy and Terms of Service.");

            setLoading("Registering");
            register({ username, password })
                .then(() => navigate("/dashboard"))
                .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                .finally(() => setLoading(false));
        }
    };

    return (
        <form className={styles.container}>
            <div className={styles.containerHeader}>
                {type === AuthenticationType.LOGIN ? "Login" : "Register"}
            </div>

            <Input
                icon="fas fa-user"
                placeholder="Username"
                type="text"
                autoComplete="username"
                maxLength={16}
                onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                }}
            />

            <Input
                icon="fas fa-lock"
                placeholder="Password"
                type="password"
                autoComplete="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                }}
            />

            {type === AuthenticationType.REGISTER && <>
                <div className={styles.agreeHolder}>
                    <Toggle
                        checked={checked}
                        onClick={() => {
                            setChecked(!checked);
                            setError("");
                        }}>
                        <div className={styles.agreeText}>
                            I agree to the <a href="/terms" target="_blank">Terms of Service</a>, I am over the age of 13,
                            and I hold no liability or harm to the creators of this website.
                        </div>
                    </Toggle>
                </div>
            </>}

            <Button.ClearButton className={styles.button} onClick={submitForm}>Let's Go!</Button.ClearButton>

            {error && <ErrorContainer>{error}</ErrorContainer>}
        </form >
    );
}


