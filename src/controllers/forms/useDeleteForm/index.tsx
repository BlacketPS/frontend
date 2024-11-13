export function useDeleteForm() {
    const deleteForm = (id: string) => new Promise<void>((resolve, reject) => window.fetch2.delete(`/api/forms/${id}`, {})
        .then(() => {
            localStorage.removeItem("USER_FORM_ID");

            resolve();
        })
        .catch(reject));

    return { deleteForm };
}
