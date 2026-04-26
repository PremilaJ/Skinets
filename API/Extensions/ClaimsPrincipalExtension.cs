using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        public static async Task<AppUser> GetUserByEmailId(this UserManager<AppUser> userManager, ClaimsPrincipal user)
        {
            var userToResturn= await userManager.Users.FirstOrDefaultAsync(x=>x.Email==user.GetEmail()); 
            return userToResturn?? throw new AuthenticationException("user cannot be found");
        }
        public static async Task<AppUser> GetUserByEmailIdWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
        {
            var userToResturn = await userManager.Users.Include(x=>x.Address).FirstOrDefaultAsync(x => x.Email == user.GetEmail());
            return userToResturn ?? throw new AuthenticationException("user cannot be found");
        }
        public static string GetEmail(this ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            return email ?? throw new AuthenticationException("email can not be found");
        }
    }
}
