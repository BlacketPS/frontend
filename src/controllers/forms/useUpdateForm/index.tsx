import { FormsFormEntity, FormsUpdateDto } from "@blacket/types";

export function useUpdateForm() {
    const updateForm = (id: string, dto: FormsUpdateDto) => new Promise<FormsFormEntity>((resolve, reject) => window.fetch2.patch(`/api/forms/${id}`, dto)
        .then((res: Fetch2Response & { data: FormsFormEntity }) => resolve(res.data))
        .catch(reject));

    return { updateForm };
}
