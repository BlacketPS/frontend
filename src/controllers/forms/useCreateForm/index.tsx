import { FormsCreateDto, FormsFormEntity } from "@blacket/types";

export function useCreateForm() {
    const createForm = (dto: FormsCreateDto) => new Promise<FormsFormEntity>((resolve, reject) => window.fetch2.post("/api/forms/create", dto)
        .then((res: Fetch2Response & { data: FormsFormEntity }) => {
            localStorage.setItem("USER_FORM_ID", res.data.id);

            resolve(res.data);
        })
        .catch(reject));

    return { createForm };
}
