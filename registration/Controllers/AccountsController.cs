using registration.Auth;
using registration.Helpers;
using registration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace registration.Controllers
{
    public class AccountsController : Controller
    {
        DatabaseContext context = new DatabaseContext();
        // GET: Role
        public static List<Helpers.Ability> ModulePermissions { get; set; }

        // GET: Dashboard
        public ActionResult Index()
        {
            ModulePermissions = Models.Accounts.permissionFor("Accounts");

            if (!Auth.Auth.Check())
            {
                return Redirect("/");
            }

            return View();
        }

        [HttpPost]
        public JsonResult get()
        {

            var items = context.Accounts.Select(item => new
            {
                Id = item.Id,
                Firstname = item.Firstname,
                Lastname = item.Lastname,
                Middlename = item.Middlename,
                Gender = item.Gender,
                Email = item.Email,
                Contact = item.Contact,
                RoleId = item.RoleId,
                Image = item.Image,
                DateCreated = item.DateCreated,
                DateUpdated = item.DateUpdated,
                DateDeleted = item.DateDeleted,
                Role = context.Roles
                                  .Where(role => role.Id == item.RoleId)
            });

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult find(int id)
        {
            List<Accounts> items = new List<Accounts>();

            items = context.Accounts.Where(item => item.Id == id).ToList();

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult create(Accounts items)
        {
            Accounts accounts = context.Accounts.FirstOrDefault(item => item.Id == items.Id);

            string message = "0";

            if (accounts == null)
            {
                items = new Accounts {
                    Firstname = items.Firstname,
                    Lastname = items.Lastname,
                    Middlename = items.Middlename,
                    Gender = items.Gender,
                    Email = items.Email,
                    Password = MD5.MD5Hash(items.Password),
                    Contact = items.Contact,
                    RoleId = items.RoleId,
                    Image = items.Image,
                    DateCreated = items.DateCreated,
                    DateUpdated = items.DateUpdated
                };

                context.Accounts.Add(items);

                context.SaveChanges();

                Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has added a new user account: " + items.Firstname + "", items.DateCreated);
            }
            else
            {
                accounts.Firstname = items.Firstname;
                accounts.Lastname = items.Lastname;
                accounts.Middlename = items.Middlename;
                accounts.Gender = items.Gender;
                accounts.Email = items.Email;
                accounts.Contact = items.Contact;
                accounts.RoleId = items.RoleId;
                accounts.Image = items.Image;
                accounts.DateUpdated = items.DateUpdated;

                context.SaveChanges();

                message = "1";

                Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has updated a user account: " + items.Firstname + "", DateTime.Now.ToString());
            }

            return Json(new { Message = message, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public ActionResult change_status(Accounts items)
        {
            Accounts Accounts = context.Accounts.FirstOrDefault(item => item.Id == items.Id);

            string message = "0";

            Accounts.DateDeleted = items.DateDeleted;

            context.SaveChanges();

            Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has updated a status to a user account: " + items.Firstname + "", items.DateDeleted);

            message = "1";

            return Json(new { Message = message, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public int login(Accounts items)
        {
            int hasuser = 0;

            List<Accounts> users = new List<Accounts>();

            users = context.Accounts.ToList();

            var validate = users.Where(item =>
            item.Email == items.Email
            && item.Password == MD5.MD5Hash(items.Password)
            && item.DateDeleted == null).FirstOrDefault();

            if (validate != null)
            {
                User user = new User();
                user.ID = Convert.ToInt32(validate.Id);
                user.Lastname = validate.Lastname;
                user.Firstname = validate.Firstname;
                user.Email = validate.Email;
                user.RoleId = Convert.ToInt32(validate.RoleId);

                var ticket = new FormsAuthenticationTicket(
                    1,
                    user.ID.ToString(),
                    DateTime.Now,
                    DateTime.Now.AddDays(7),
                    true,
                    user.ToString() // get the serialized user data. F12 on ToString() to view the implementation
                );

                // create an encrypted cookie
                var encryptedCookie = FormsAuthentication.Encrypt(ticket);

                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedCookie);
                cookie.Expires = ticket.Expiration;
                cookie.Path = ticket.CookiePath;
                //Response.Cookies.Add(cookie);
                HttpContext.Response.Cookies.Add(cookie);

                hasuser = validate.Id;

                Helpers.Log.create(Auth.Auth.user().ID,
                Auth.Auth.user().Firstname + " " + Auth.Auth.user().Lastname + " has logged in.", DateTime.Now.ToString());
            }
            else
            {
                hasuser = 0;
            }

            return hasuser;
        }
    }
}