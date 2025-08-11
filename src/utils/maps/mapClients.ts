export const mapClients = (client: any) => ({
    id: client.id,
    user_id: client.user_id,
    range_name: client.range.name,
    username: client.user.username,
    first_name: client.user.first_name,
    last_name: client.user.last_name,
    email: client.user.email,
    phone: client.user.phone,
    image: client.user.image,
})