import os,logging
from dotenv import load_dotenv
from telegram import Update,InlineKeyboardButton,InlineKeyboardMarkup
from telegram.constants import ChatMemberStatus
from telegram.ext import Application,CommandHandler,CallbackQueryHandler,ContextTypes
load_dotenv();BOT_TOKEN=os.getenv("BOT_TOKEN","").strip();CHANNEL_USERNAME=os.getenv("CHANNEL_USERNAME","@PROMO_OT_SAINT").strip();PROMO_CODE=os.getenv("PROMO_CODE","SAINT100").strip();logging.basicConfig(level=logging.INFO)
def keyboard():
 c=CHANNEL_USERNAME.lstrip("@");return InlineKeyboardMarkup([[InlineKeyboardButton("📢 Підписатися на канал",url=f"https://t.me/{c}")],[InlineKeyboardButton("✅ Перевірити підписку",callback_data="check_sub")]])
async def start(update:Update,context:ContextTypes.DEFAULT_TYPE):
 await update.effective_message.reply_html(f"🎁 <b>PROMO SAINT</b>\n\n1️⃣ Підпишись на {CHANNEL_USERNAME}\n2️⃣ Натисни «Перевірити підписку»\n3️⃣ Після успішної перевірки бот покаже промокод.\n\n21+ · Грайте відповідально.",reply_markup=keyboard())
async def check_sub(update:Update,context:ContextTypes.DEFAULT_TYPE):
 q=update.callback_query;await q.answer();uid=q.from_user.id
 try:
  m=await context.bot.get_chat_member(CHANNEL_USERNAME,uid);ok=m.status in {ChatMemberStatus.MEMBER,ChatMemberStatus.ADMINISTRATOR,ChatMemberStatus.OWNER}
 except Exception:
  await q.message.reply_text("Не вдалося перевірити підписку. Переконайся, що бот доданий адміністратором каналу, та спробуй ще раз.");return
 if ok: await q.message.reply_html(f"✅ <b>Підписку підтверджено!</b>\n\nТвій промокод: <code>{PROMO_CODE}</code>\n\n21+ · Перевір умови використання промокоду.")
 else: await q.message.reply_html(f"Підписку ще не знайдено.\n\nПідпишись на {CHANNEL_USERNAME} і натисни перевірку ще раз.",reply_markup=keyboard())
def main():
 if not BOT_TOKEN or BOT_TOKEN=="PASTE_BOTFATHER_TOKEN_HERE": raise RuntimeError("Set BOT_TOKEN in .env")
 app=Application.builder().token(BOT_TOKEN).build();app.add_handler(CommandHandler("start",start));app.add_handler(CallbackQueryHandler(check_sub,pattern="^check_sub$"));app.run_polling(allowed_updates=Update.ALL_TYPES)
if __name__=="__main__":main()
