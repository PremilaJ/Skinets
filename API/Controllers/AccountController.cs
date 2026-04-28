using API.DTOs;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    public class AccountController(SignInManager<AppUser> signInManager) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };
            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code, error.Description);
                   
                }
                return ValidationProblem();
            }
            return Ok();
;        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            await signInManager.SignOutAsync();
            return NoContent(); 
        }
        [HttpGet("user-info")]
        public async Task<IActionResult> GetUSerInfo()
        {
         if (User.Identity?.IsAuthenticated==false) return NoContent();

            var user = await signInManager.UserManager.GetUserByEmailIdWithAddress(User);
           
            return Ok(new
            {
                FirstName=user.FirstName,
                LastName=user.LastName,
                Email=user.Email,
                Address=user.Address.ToDto()
            });
        }
        [HttpGet("auth-state")]
        public ActionResult GetAuthState()
        {
            return Ok(new

            { IsAuthenticated = User.Identity?.IsAuthenticated ?? false
            });
        }
        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Address>> AddOrUpdateAddress(AddressDto addressDto)
        {
          var user=await signInManager.UserManager.GetUserByEmailIdWithAddress(User);
            if (user.Address == null)
                user.Address = addressDto.ToEntity();
            else
                 user.Address.UpdateAddress(addressDto);
            var result = await signInManager.UserManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("can not update address");
            return Ok(user.Address.ToDto());

        }
    }
}
