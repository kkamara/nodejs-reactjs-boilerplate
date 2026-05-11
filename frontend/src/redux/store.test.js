import store from "./store"

describe("redux store", () => {
  it("creates the expected reducer slices", () => {
    expect(Object.keys(store.getState())).toEqual([
      "auth",
      "users",
      "avatar",
      "updateUserSettings",
      "removeAvatar",
    ])
  })
})