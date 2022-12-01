import { IBPDatatype } from './i-b-p-datatype';
import { IBPDep } from './i-b-p-dep';
import { IBPPost } from './i-b-p-post';
import { IBPUser } from './i-b-p-user';

/***/
export interface IBPMetadata {
    user: IBPUser;
    datatype: IBPDatatype;
    dep: IBPDep;
    post: IBPPost;
}
