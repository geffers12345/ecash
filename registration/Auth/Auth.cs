using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace registration.Auth
{
    public class Auth
    {
        public static User user()
        {
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

            if (authCookie == null)
                return new User();

            FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);

            return User.Parse(ticket.UserData);
        }

        public static bool Check()
        {
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

            if (authCookie == null)
                return false;

            FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);

            if (ticket.UserData == "")
                return false;

            return true;
        }
    }
}