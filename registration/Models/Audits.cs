using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class Audits
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Action { get; set; }

        [Required]
        public int AccountId { get; set; }
        public virtual Accounts Accounts { get; set; }

        [Required]
        public string DateCreated { get; set; }
    }
}