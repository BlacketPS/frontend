import { FormProps } from "./form.d";

export default function Form({ children, onSubmit, ...props }: FormProps) {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit) onSubmit(event);
    };

    return (
        <form onSubmit={handleSubmit} {...props}>
            {children}
        </form>
    );
}
