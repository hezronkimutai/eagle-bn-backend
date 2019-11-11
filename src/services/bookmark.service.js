import db from '../database/models/index';

const BookmarkService = {
  async getBookmarkedAccommodation(UserId) {
    const result = await db.Accommodations.findAll({
      include: [{ model: db.Bookmarks, where: { UserId }, attributes: [] }],
    });
    return result;
  },
  async bookmark(data) {
    const bookmark = await db.Bookmarks.findOrCreate({ where: data, data });
    return bookmark;
  },

  async undoBookmark(data) {
    const result = await db.Bookmarks.destroy({ where: data });
    return result;
  }
};

export default BookmarkService;
