import { Fragment, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForms } from "@controllers/forms/useForms/index";
import { useUpdateForm } from "@controllers/forms/useUpdateForm/index";
import { useRegisterFromForm } from "@controllers/auth/useRegisterFromForm/index";
import { useUser } from "@stores/UserStore/index";
import { Button, Input, Loader } from "@components/index";
import styles from "./form.module.scss";

import { FormsFormEntity, FormStatusEnum } from "@blacket/types";

export default function Form() {
    const formId = localStorage.getItem("USER_FORM_ID");
    if (!formId) return <Navigate to="/register" />;

    const { user } = useUser();

    if (user) return <Navigate to="/dashboard" />;

    const { getForm } = useForms();
    const { updateForm } = useUpdateForm();

    const { registerFormForm } = useRegisterFromForm();

    const [loading, setLoading] = useState<boolean>(true);
    const [form, setForm] = useState<FormsFormEntity | null>(null);
    const [newFormReason, setNewFormReason] = useState<string>("");

    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const navigate = useNavigate();

    const fetchForm = () => getForm(formId)
        .then((form) => setForm(form))
        .catch(() => setForm(null))
        .finally(() => setLoading(false));

    const updateFormReason = () => {
        if (newFormReason.length < 1) return;

        setLoading(true);

        updateForm(formId, { reasonToPlay: `${form!.reasonToPlay.split("\n")[0]}\n\n${newFormReason}` })
            .then((form) => setForm(form))
            .catch(() => setForm(null))
            .finally(() => setLoading(false));
    };

    const register = () => {
        if (password !== passwordConfirm) return;

        setLoading(true);

        registerFormForm({ formId, password })
            .then(() => {
                localStorage.removeItem("USER_FORM_ID");

                navigate("/dashboard");
            })
            .catch(() => {
                localStorage.removeItem("USER_FORM_ID");

                navigate("/register");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchForm();

        const interval = setInterval(() => fetchForm(), 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <form className={styles.container}>
            <div className={styles.containerHeader}>Form</div>

            {!loading ? form && <>
                <div className={styles.formInfo}>
                    Status: {form.status === FormStatusEnum.PENDING ? <span className={styles.formStatus}>
                        Pending
                        <div className={styles.loadingContainer} style={{ display: "inline-block", width: 20, height: 20, marginLeft: 25 }}>
                            <Loader noModal style={{ transform: "scale(0.9)", marginTop: 5 }} />
                        </div>
                    </span> : form.status === FormStatusEnum.DENIED ? <span className={styles.formStatus}>
                        Denied
                        <i className="fas fa-circle-xmark" style={{ color: "#ff0000" }} />
                    </span> : <span className={styles.formStatus}>
                        Accepted
                        <i className="fas fa-circle-check" style={{ color: "#00ff00" }} />
                    </span>}
                </div>

                <div className={styles.formInfo}>
                    Username: {form.username}
                </div>

                {form.status === FormStatusEnum.DENIED && <div className={styles.formInfo}>
                    Denied Reason: {form.deniedReason}
                </div>}

                <div className={styles.formReasonContainer}>
                    {form.status === FormStatusEnum.PENDING ? <div className={styles.formReason}>
                        {form.reasonToPlay.split("\n").map((line, index) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                    </div> : form.status === FormStatusEnum.DENIED ? <div className={styles.formDenied}>
                        <Input
                            icon="fas fa-question"
                            placeholder="Why do you want to play?"
                            onChange={(e) => {
                                setNewFormReason(e.target.value);
                            }}
                            value={newFormReason}
                        />

                        <Button.ClearButton
                            onClick={() => updateFormReason()}
                        >
                            Update Form
                        </Button.ClearButton>
                    </div> : <div className={styles.formAccepted}>
                        <Input
                            icon="fas fa-lock"
                            placeholder="Password"
                            type="password"
                            autoComplete="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                        <Input
                            icon="fas fa-lock"
                            placeholder="Confirm Password"
                            type="password"
                            autoComplete="password"
                            onChange={(e) => {
                                setPasswordConfirm(e.target.value);
                            }}
                        />

                        <Button.ClearButton
                            onClick={() => register()}
                        >
                            Create Account
                        </Button.ClearButton>
                    </div>}
                </div>

                <div className={styles.formFooter}>
                    {form.status === FormStatusEnum.PENDING ? <>
                        Please wait for a staff member to review your form.
                        <br />
                        NOTE: This may take up to 24 hours.
                    </> : form.status === FormStatusEnum.DENIED ? <>
                        Your form has been denied. Please fill out your form again with the correct information and resubmit it.
                    </> : <>
                        Congratulations! Your form has been accepted. Please enter a password to complete your registration.
                    </>}
                </div>
            </> : <div className={styles.loadingContainer}>
                <Loader noModal style={{ marginBottom: 50 }} />
            </div>}
        </form>
    );
}
