import { prisma } from "./prisma.server";

export const getReceitas = async () => {
  return prisma.receitas.findMany({
    orderBy: {
        data: 'desc'
    },
    take: 400
  });
};
export const getReceita = async (receitaId: string) => {
    
  return prisma.receitas.findUnique({
    where: {
      id: receitaId,
    },
  });
};

export const updateReceita = async (receita: any) => {
  
  const newReceita = await prisma.receitas.update({
    where: {
      id: receita.id,
    },
    data: {
        valor: parseFloat(receita.valor.replace(".", "").replace(",", ".")),
        data: new Date(receita.date),
        conta    :receita.conta,
        descricao: receita.descricao,
        loja : receita.loja.toUpperCase(), 
        status: receita.status,
    },
  });
  return { newReceita };
};

export const createReceita = async(receita:any)=>{

    return prisma.receitas.create({
    data:{
    valor: parseFloat(receita.valor.replace(".", "").replace(",", ".")),
    conta    :receita.conta,
    descricao: receita.descricao,
    loja : receita.loja.toUpperCase(),     
    data    : new Date(receita.date) ,
    status   : receita.status
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

export const deleteReceita = async (receita: any) => {
  await prisma.receitas.delete({
    where: {
      id: receita.id,
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

export const createForm = async (forma:any)=>{
console.log(forma)
    const formal = forma.forma.toLowerCase()

const newForma = await prisma.formas.create({
    data:{
        forma: formal,
        etiqueta: formal.charAt(0).toUpperCase() + formal.slice(1)
    }
})
return newForma
}