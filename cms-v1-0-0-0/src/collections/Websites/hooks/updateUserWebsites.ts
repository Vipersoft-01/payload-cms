export const updateUserWebsites = async ({
    req,
    context,
    userIDsAddedTowebsite,
    userIDsRemovingwebsite,
    websiteID,
}) => {
    // get the episodes that need to have the series updated
    const { docs: usersToUpdate } = await req.payload.find({
        collection: 'users',
        pagination: false,
        depth: 0,
        req,
        where: {
            id: {
                in: userIDsAddedTowebsite.concat(userIDsRemovingwebsite),
            }
        }
    })

    const promises: Promise<any>[] = []
    usersToUpdate.forEach((user) => {
        let websites = user.websites || []
        if (userIDsAddedTowebsite.includes(user.id)) {
            websites = websites.concat(websiteID)
        } else {
            websites = websites.filter((id) => id !== websiteID)
        }
        promises.push(req.payload.update({
            req,
            collection: 'users',
            id: user.id,
            context,
            data: {
                websites,
            }
        }))
    })
    await Promise.all(promises)
}