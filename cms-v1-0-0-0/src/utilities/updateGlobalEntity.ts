import { PayloadRequest } from "payload/types";

export async function updateEntityWithCurrentUserDetails(req: PayloadRequest, doc: any, collection: any) {
    //get user
    const user = req.user;
    //get website
    const websites = user?.websites && user?.websites?.length > 0 ? user.websites[0] : null;


    if (websites != null) {
        //get user from db
        const { docs: found_users_db } = await req.payload.find({
            collection: 'users',
            pagination: false,
            depth: 0,
            req,
            where: {
                id: {
                    equals: user.id
                }
            }
        })

        //get user from db
        const { docs: found_websites_db } = await req.payload.find({
            collection: 'websites',
            pagination: false,
            depth: 0,
            req,
            where: {
                id: {
                    equals: websites.id
                }
            }
        })


        //get page that has been updated
        const { docs: found_pages_db } = await req.payload.find({
            collection: collection,
            pagination: false,
            depth: 0,
            req,
            where: {
                id: {
                    equals: doc.id
                }
            }
        })

        if (found_pages_db) {

            found_pages_db.forEach(async (page) => {
                page.owner = JSON.stringify(found_users_db[0]),
                    page.website = JSON.stringify(found_websites_db[0])
                await req.payload.update({ collection: 'pages', id: page.id, data: page })
            });


        } else {
            throw Error("Page not found!")
        }
    }
}
