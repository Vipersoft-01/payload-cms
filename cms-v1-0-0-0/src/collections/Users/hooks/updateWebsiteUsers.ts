export const updateWebsiteUsers = async ({
    req,
    context,
    websiteIDsAddedToUser,
    websiteIDsRemovingUser,
    userID,
}) => {
    // get the episodes that need to have the series updated
    const { docs: websitesToUpdate } = await req.payload.find({
        collection: 'websites',
        pagination: false,
        depth: 0,
        req,
        where: {
            id: {
                in: websiteIDsAddedToUser.concat(websiteIDsRemovingUser),
            }
        }
    })

    const promises: Promise<any>[] = []
    websitesToUpdate.forEach((website) => {
        let users = website.users || []
        if (websiteIDsAddedToUser.includes(website.id)) {
            users = users.concat(userID)
        } else {
            users = users.filter((id) => id !== userID)
        }
        promises.push(req.payload.update({
            req,
            collection: 'websites',
            id: website.id,
            context,
            data: {
                users,
            }
        }))
    })
    await Promise.all(promises)
}