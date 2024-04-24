export default function getUser(user: string) {
    return new Promise((resolve, reject) => window.fetch2.get(`/api/users/${user}`)
        .then((res) => resolve(res.data.user))
        .catch(reject));
}
