import "dotenv/config";

describe("App integration tests", () => {
  const baseUrl = "http://localhost:5000/api";

  const someUser = {
    id: "",
    name: "someName",
    email: "someEmail@abv.bg",
    password: "somePassword",
    role: ["admin"],
    timestamp: "",
  };

  const someAdmin = {
    id: "",
    name: "Tim White",
    email: "white@abv.bg",
    password: process.env.ADMIN_PASSWORD,
    role: ["admin"],
    timestamp: "",
  };

  const someBook = {
    _id: "",
    title: "someTitle",
    description: "someDescription",
    imgUrl:
      "https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    cloudinaryId: "someCloudinaryId",
    author: "someAuthor",
    user: "someUserId",
    userName: "someUserName",
    likes: [],
    uploadedByUsers: [],
    createdAt: "someCreateDate",
    updatedAt: "someUpdateDate",
    __v: 0,
  };

  // let token = "";
  let adminToken = "";
  let createdUserId = "";
  let createdBookId = "";

  it("should login an admin", async () => {
    const result = await fetch(baseUrl + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(someAdmin),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(200);
    expect(resultBody.token).toBeDefined();
    adminToken = resultBody.token;
  });

  it("should register new user", async () => {
    const result = await fetch(baseUrl + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(201);
    expect(resultBody.token).toBeDefined();
    // token = resultBody.token;
  });

  it("should login a registered user", async () => {
    const result = await fetch(baseUrl + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(200);
    expect(resultBody.token).toBeDefined();
    // token = resultBody.token;
    createdUserId = resultBody._id;
  });

  it("should delete a registered user", async () => {
    const result = await fetch(baseUrl + "/users/admin/user/" + createdUserId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const resultBody = await result.json();

    expect(result.status).toBe(200);
    expect(resultBody.message).toEqual("User deleted");
  });

  it("should create a book if authorized", async () => {
    const result = await fetch(baseUrl + "/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(someBook),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(201);
    expect(resultBody._id).toBeDefined();
    createdBookId = resultBody._id;
  });

  it("should return a book by id", async () => {
    const result = await fetch(baseUrl + `/books/${createdBookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const resultBody = await result.json();

    expect(result.status).toBe(200);
    expect(resultBody.book).toEqual(
      expect.objectContaining({
        _id: createdBookId,
      })
    );
  });

  it("should update a book if authorized", async () => {
    const updateResult = await fetch(baseUrl + `/books/${createdBookId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: "someOtherTitle",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(updateResult.status).toBe(200);

    const getBook = await fetch(baseUrl + `/books/${createdBookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const getBookBody = await getBook.json();
    expect(getBookBody.book.title).toBe("someOtherTitle");
  });

  it("should delete a book by id if authorized", async () => {
    const deleteResult = await fetch(baseUrl + `/books/${createdBookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const result = await deleteResult.json();
    expect(deleteResult.status).toBe(200);
    expect(result.message).toBe(
      `Deleted Book ${createdBookId} image missing required parameter - public_id`
    );

    const getBook = await fetch(baseUrl + `/books/${createdBookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(getBook.status).toBe(404);
  });
});
