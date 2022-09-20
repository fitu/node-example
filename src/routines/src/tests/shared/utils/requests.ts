import { SuperTest, Test } from "supertest";

import { BASE_VERSION } from "@app/app";

class TestRequest {
    constructor(private readonly api: SuperTest<Test>) {}

    private call(method: string) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return (path: string) => this.api[method](`${BASE_VERSION}${path}`);
    }

    public get = this.call("get");

    public post = this.call("post");

    public put = this.call("put");

    public delete = this.call("delete");
}

export default TestRequest;
