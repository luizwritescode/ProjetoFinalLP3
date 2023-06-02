using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

using MODEL;

namespace DAL.DBContext;


public partial class DatabaseMdf : DbContext
{
    public DatabaseMdf()
    {
    }

    public DatabaseMdf(DbContextOptions<DatabaseMdf> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Distancias> Distancia { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename=C:\\Users\\luiz\\Desktop\\cimatec\\ProjetoFinalLP3\\DAL\\database\\Database1.mdf;Integrated Security=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cliente__3214EC0711B84552");

            entity.ToTable("Cliente");

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Telefone)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Distancias>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Distanci__3214EC07C8B0DFCD");

            entity.Property(e => e.MunicipioDestino)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MunicipioOrigem)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pedido__3214EC072FAB14F6");

            entity.ToTable("Pedido");

            entity.Property(e => e.Data).HasColumnType("datetime");
            entity.Property(e => e.MunicipioDestino)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MunicipioOrigem)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.ClienteNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.Cliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Pedido_Cliente");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
