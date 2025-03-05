const request = require("supertest");
const app = require("../server");
const fs = require("fs");
const path = require("path");
require("./testDB");

let authTokenUser1, authTokenUser2, uploadedCatId;

describe("Cat Pics API", () => {
  beforeAll(async () => {
    // Register User 1
    const user1Res = await request(app).post("/api/auth/register").send({
      username: "user1",
      password: "password123",
    });
    authTokenUser1 = user1Res.body.token;

    // Register User 2 (to test unauthorized access)
    const user2Res = await request(app).post("/api/auth/register").send({
      username: "user2",
      password: "password123",
    });
    authTokenUser2 = user2Res.body.token;
  });

  it("should upload a cat picture for User 1", async () => {
    const testImagePath = path.join(__dirname, "test-cat.jpg");
    fs.writeFileSync(testImagePath, Buffer.from("fake_image_data"));

    const res = await request(app)
      .post("/api/cats")
      .set("Authorization", `Bearer ${authTokenUser1}`)
      .attach("catPic", testImagePath);

    console.log("Upload response:", res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");

    uploadedCatId = res.body._id;

    await new Promise((resolve) => setTimeout(resolve, 500)); // This is to ensure DB commits

    fs.unlinkSync(testImagePath);
  });

  it("should get all cat pictures for User 1 (should return 1)", async () => {
    const res = await request(app)
      .get("/api/cats")
      .set("Authorization", `Bearer ${authTokenUser1}`);

    console.log("Fetch All Cats Response (User 1):", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should not return any cat pictures for User 2", async () => {
    const res = await request(app)
      .get("/api/cats")
      .set("Authorization", `Bearer ${authTokenUser2}`);

    console.log("Fetch All Cats Response (User 2):", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0); // User 2 should see no images
  });

  it("should fetch a specific cat picture for User 1", async () => {
    const res = await request(app)
      .get(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser1}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should not fetch a cat picture uploaded by User 1 when requested by User 2", async () => {
    const res = await request(app)
      .get(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser2}`);

    expect(res.statusCode).toEqual(404); // User 2 should get a 404
  });

  it("should update a cat picture only for the owner (User 1)", async () => {
    const res = await request(app)
      .put(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser1}`)
      .attach("catPic", Buffer.from("newdummydata"), "newcat.jpg");

    console.log("Update Response:", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.filename).toContain("newcat");
  });

  it("should not allow User 2 to update User 1's cat picture", async () => {
    const res = await request(app)
      .put(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser2}`)
      .attach("catPic", Buffer.from("newdummydata"), "newcat.jpg");

    console.log("Unauthorized Update Response:", res.body);

    expect(res.statusCode).toEqual(404); // User 2 should get a 404
  });

  it("should delete a cat picture only for the owner (User 1)", async () => {
    const res = await request(app)
      .delete(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser1}`);

    console.log("Delete Response:", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Cat picture deleted");
  });

  it("should not allow User 2 to delete User 1's cat picture", async () => {
    const res = await request(app)
      .delete(`/api/cats/${uploadedCatId}`)
      .set("Authorization", `Bearer ${authTokenUser2}`);

    console.log("Unauthorized Delete Response:", res.body);

    expect(res.statusCode).toEqual(404); // User 2 should get a 404
  });
});
