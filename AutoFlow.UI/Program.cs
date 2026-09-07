using AutoFlow.Domain.Interfacees;
using AutoFlow.Infrastructure.Data;
using AutoFlow.Infrastructure.Repositorios;
using AutoFlow.Service.Interface;
using AutoFlow.Service.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

#region [Add services to the container]

    builder.Services.AddControllersWithViews();
    builder.Services.AddAutoMapper(cfg => cfg.AddMaps(AppDomain.CurrentDomain.GetAssemblies()));
    builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
#endregion

#region [Área de configuracao dos serviços] 

    builder.Services.AddScoped<IVeiculoService, VeiculoService>();
    builder.Services.AddScoped<IVeiculoRepositorio, VeiculoRepositorio>();

    builder.Services.AddScoped<IClienteService, ClienteService>();
    builder.Services.AddScoped<IClienteRepositorio, ClienteRepositorio>();

#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Cliente}/{action=Index}/{id?}");

app.Run();
