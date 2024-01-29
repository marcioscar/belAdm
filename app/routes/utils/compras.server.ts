import { prisma } from "./prisma.server";

export const getCompras = async () => {
  return prisma.compras.findMany({
    orderBy: {
        data: 'desc'
    },
    take: 300
  });
};

export const getFornecedores = async () => {
  return prisma.fornecedores.findMany({
    orderBy: {
        nome: 'asc'
    },
    
  });
};

export const getCompra = async (compraId: string) => {
    
  return prisma.compras.findUnique({
    where: {
      id: compraId,
    },
  });
};

export const updateCompra = async (compra: any) => {
  
  const newCompra = await prisma.compras.update({
    where: {
      id: compra.id,
    },
    data: {
        valor: parseFloat(compra.valor.replace(".", "").replace(",", ".")),
        data: new Date(compra.date),
        fornecedor: compra.fornecedor,
        nf : +compra.nf
    },
  });
  return { newCompra };
};

export const createCompra = async(compra:any)=>{
    return prisma.compras.create({
    data:{
        valor: parseFloat(compra.valor.replace(".", "").replace(",", ".")),
        fornecedor    :compra.fornecedor,
        nf:  compra.nf,
        data    : new Date(compra.date) ,
    }
})

}

export const baixarReceita = async (id: any) => {
  
  return prisma.receitas.update({
    where: {
      id: id,
    },
    data: {
      status: "Recebido",
    },
  });
};

export const deleteCompra = async (compra: any) => {
  await prisma.compras.delete({
    where: {
      id: compra.id,
    },
  });
};


export const getFormas = async()=>{
    return prisma.formas.findMany({
      orderBy: {
        forma: 'asc'
    },
    })
}

export const createFornecedor = async (fornecedor:any)=>{
console.log(fornecedor)
const newFornecedor = await prisma.fornecedores.create({
    data:{
        nome: fornecedor.nome,
    }
})
return newFornecedor
}