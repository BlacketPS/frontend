import { HTMLAttributes } from "react";

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}
