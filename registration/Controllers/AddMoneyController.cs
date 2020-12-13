using registration.Helpers;
using registration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Drawing;

namespace registration.Controllers
{
    public class AddMoneyController : Controller
    {
        DatabaseContext context = new DatabaseContext();
        // GET: AddMoney
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult create(StudentTransactions items)
        {
            StudentTransactions transactions = context.StudentTransactions.FirstOrDefault(item => item.Id == items.Id);
            
            if (transactions == null)
            {
                items = new StudentTransactions
                {
                    AccountId = Auth.Auth.user().ID,
                    TransactionType = items.TransactionType,
                    Amount = items.Amount,
                    Code = items.Code,
                    QrPath = "studentno_" + Auth.Auth.user().ID + ".png",
                    IsActive = false,
                    DateCreated = items.DateCreated,
                    DateUpdated = items.DateCreated,
                    DateDeleted = items.DateCreated
                };

                context.StudentTransactions.Add(items);

                context.SaveChanges();

                transactions = context.StudentTransactions.FirstOrDefault(item => item.Id == items.Id);
            }

            return Json(new { data = transactions, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public void saveQr(string base64image)
        {
            if (string.IsNullOrEmpty(base64image))
                return;

            var t = base64image.Substring(22);  // remove data:image/png;base64,

            byte[] bytes = Convert.FromBase64String(t);

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }

            var fullPath = Path.Combine(Server.MapPath("/content/img/qrcodes/"), "studentno_" + Auth.Auth.user().ID + ".png");

            image.Save(fullPath, System.Drawing.Imaging.ImageFormat.Png);
        }
    }
}