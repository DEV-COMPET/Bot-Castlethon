import { FastifyInstance } from 'fastify';
import { listMember } from '../modules/membros/usecases/listMember/listMember';
import { getMemberByEmail } from '../modules/membros/usecases/getMemberByEmail/getMemberByEmail';
import { createMember } from '../modules/membros/usecases/createMember/createMember';
import { updateMember } from '../modules/membros/usecases/updateMember/updateMember';
import { deleteMember } from '../modules/membros/usecases/deleteMember/deleteMember';

export async function membersRoutes(app: FastifyInstance) {
    app.get('/', listMember)
    app.get('/:email', getMemberByEmail)
    app.post('/', createMember)
    app.put("/:nome", updateMember)
    app.delete("/", deleteMember)
}