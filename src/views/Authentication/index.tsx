import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore";
import { useLogin } from "@controllers/auth/useLogin/index";
import { useRegister } from "@controllers/auth/useRegister/index";
import { useCreateForm } from "@controllers/forms/useCreateForm/index";
import { Input, ErrorContainer, Dropdown, Toggle, Button } from "@components/index";
import { OtpModal } from "./components/index";

import { AuthenticationType, AuthenticationProps } from "./authentication.d";

import styles from "./authentication.module.scss";

export default function Authentication({ type }: AuthenticationProps) {
    const formId = localStorage.getItem("USER_FORM_ID");
    if (formId) return <Navigate to="/form" />;

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [foundBy, setFoundBy] = useState<string>("");
    const [otherFoundBy, setOtherFoundBy] = useState<string>("");
    const [whyPlay, setWhyPlay] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();

    const { login } = useLogin();
    const { register } = useRegister();
    const { createForm } = useCreateForm();

    if (user) return <Navigate to="/dashboard" />;

    const submitForm = async () => {
        if (username === "") return setError("Where's the username?");
        if (type === AuthenticationType.LOGIN && import.meta.env.VITE_USER_FORMS_ENABLED === "true" && password === "") return setError("Where's the password?");
        if (type === AuthenticationType.REGISTER) {
            switch (true) {
                case (import.meta.env.VITE_USER_FORMS_ENABLED === "false" && accessCode === ""):
                    return setError("Where's the access code?");
                case (foundBy === "Other" && otherFoundBy === ""):
                    return setError("Where did you find us?");
                case (foundBy === ""):
                    return setError("Where did you find us?");
                case (whyPlay === ""):
                    return setError("Why do you want to join?");
            }
        }

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
        } else if (type === AuthenticationType.REGISTER && import.meta.env.VITE_USER_FORMS_ENABLED === "false") {
            if (!checked) return setError("You must agree to our Privacy Policy and Terms of Service.");
            setLoading("Registering");
            register(username, password, accessCode, checked)
                .then(() => navigate("/dashboard"))
                .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                .finally(() => setLoading(false));
        } else if (type === AuthenticationType.REGISTER && import.meta.env.VITE_USER_FORMS_ENABLED === "true") {
            if (!checked) return setError("You must agree to our Privacy Policy and Terms of Service.");
            setLoading("Creating form");
            createForm({
                username, reasonToPlay: `Found by: ${foundBy === "Other" ? otherFoundBy : foundBy}\n\n${whyPlay}`, acceptedTerms: checked
            })
                .then(() => navigate("/form"))
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

            {type === AuthenticationType.LOGIN && import.meta.env.VITE_USER_FORMS_ENABLED === "true" && <Input
                icon="fas fa-lock"
                placeholder="Password"
                type="password"
                autoComplete="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                }}
            />}

            {type === AuthenticationType.REGISTER && <>
                {import.meta.env.VITE_USER_FORMS_ENABLED === "false" && <Input
                    icon="fas fa-lock"
                    placeholder="Access Code"
                    type="password"
                    onChange={(e) => {
                        setAccessCode(e.target.value);
                        setError("");
                    }}
                />}

                {import.meta.env.VITE_USER_FORMS_ENABLED === "true" && <>
                    <Dropdown
                        options={[
                            { label: "Select where you found us...", value: "" },
                            { label: "Google", value: "Google" },
                            { label: "YouTube", value: "YouTube" },
                            { label: "Discord", value: "Discord" },
                            { label: "Friend", value: "Friend" },
                            { label: "Other", value: "Other" }
                        ]}
                        onChange={(value: string) => {
                            setFoundBy(value);
                            setOtherFoundBy("");
                            setError("");
                        }}
                    >
                        Select where you found us...
                    </Dropdown>

                    {foundBy === "Other" && <Input
                        icon="fas fa-location-arrow"
                        placeholder="Where did you find us?"
                        type="text"
                        onChange={(e) => {
                            setOtherFoundBy(e.target.value);
                            setError("");
                        }}
                        value={otherFoundBy}
                    />}

                    {(foundBy && (foundBy !== "Other" || (foundBy === "Other" && otherFoundBy !== ""))) && <Input
                        icon="fas fa-question"
                        placeholder="Why do you want to play?"
                        type="text"
                        onChange={(e) => {
                            setWhyPlay(e.target.value);
                            setError("");
                        }}
                    />}
                </>
                }

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


