// services/notificationService.js
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const Manga = require('../models/Manga');
const User = require('../models/User');

class NotificationService {
    // Send notification for new chapter
    static async notifyNewChapter(mangaId, chapter) {
        try {
            const manga = await Manga.findById(mangaId);
            if (!manga) return;

            // Get all users following this manga with notifications enabled
            const follows = await Follow.find({
                manga: mangaId,
                notificationsEnabled: true
            }).populate('user');

            const notifications = follows.map(follow => ({
                user: follow.user._id,
                type: 'new_chapter',
                title: `New Chapter: ${manga.title}`,
                message: `Chapter ${chapter.chapterNumber} - ${chapter.title || ''} has been released!`,
                manga: mangaId,
                chapter: chapter._id,
                data: {
                    chapterNumber: chapter.chapterNumber,
                    chapterTitle: chapter.title
                }
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
                console.log(`Sent ${notifications.length} notifications for new chapter`);
            }

            // TODO: Add email notifications here

        } catch (error) {
            console.error('Error sending chapter notifications:', error);
        }
    }

    // Send general manga update notification
    static async notifyMangaUpdate(mangaId, updateType, message) {
        try {
            const manga = await Manga.findById(mangaId);
            if (!manga) return;

            const follows = await Follow.find({
                manga: mangaId,
                notificationsEnabled: true
            });

            const notifications = follows.map(follow => ({
                user: follow.user._id,
                type: 'manga_update',
                title: `Manga Update: ${manga.title}`,
                message: message,
                manga: mangaId,
                data: { updateType }
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (error) {
            console.error('Error sending manga update notifications:', error);
        }
    }

    // Get user's unread notifications count
    static async getUnreadCount(userId) {
        return await Notification.countDocuments({
            user: userId,
            isRead: false
        });
    }
}

module.exports = NotificationService;