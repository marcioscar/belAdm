
import { prisma } from "./prisma.server";


export const getDespesas = async () => {
  return prisma.despesas.findMany({
    orderBy: {
        data: 'desc'
    },
    take: 600
  });
};

export const getTransferencias = async () => {
  return prisma.transferencias.findMany({
    orderBy: {
        data: 'desc'
    },
    take: 400
  });
};

export const getDespesa = async (despesaId: string) => {
    
  return prisma.despesas.findUnique({
    where: {
      id: despesaId,
    },
  });
};

export const getFornecedores = async () => {
  return prisma.fornecedores.findMany({
    orderBy: {
        nome: 'asc'
    },
    
  });
};
export const createFornecedor = async (fornecedor:any)=>{

const newFornecedor = await prisma.fornecedores.create({
    data:{
        nome: fornecedor.nome,
    }
})
return newFornecedor
}

export const updateDespesa = async (despesa: any) => {
  
  const newReceita = await prisma.despesas.update({
    where: {
      id: despesa.id,
    },
    data: {
        valor: parseFloat(despesa.valor.replace(".", "").replace(",", ".")),
        data: new Date(despesa.date),
        conta    :despesa.conta,
        descricao: despesa.descricao,
        tipo : despesa.tipo, 
        fornecedor: despesa.fornecedor,
        comprovante: despesa.img,
        loja   : despesa.loja,
    },
  });
  return { newReceita };
};

export const createDespesa = async(despesa:any)=>{

    return prisma.despesas.create({
    data:
        {
        valor: parseFloat(despesa.valor.replace(".", "").replace(",", ".")),
        conta    :despesa.conta,
        descricao: despesa.descricao,
        data    : new Date(despesa.date) ,
        tipo   : despesa.tipo,
        loja   : despesa.loja,
        fornecedor: despesa.fornecedor,
        comprovante: despesa.img
     }
})

}
export const createTransferencia = async(transferencia:any)=>{

    const transf = await prisma.transferencias.create({
    data:
        {
        valor: parseFloat(transferencia.valor.replace(".", "").replace(",", ".")),
        origem: transferencia.origem,
        destino: transferencia.destino,
        data    : new Date(transferencia.date) ,
        
     }
})
const desp = await prisma.despesas.create({
    data:
        {
        valor: parseFloat(transferencia.valor.replace(".", "").replace(",", ".")),
        conta    :'transferencia',
        descricao: transferencia.origem + ' ->  ' + transferencia.destino,
        data    : new Date(transferencia.date) ,
        tipo   : 'variavel',
        loja   : transferencia.destino,
        fornecedor: transferencia.origem,
        
     }
})


    const rec = await prisma.receitas.create({
    data:
    {
    valor: parseFloat(transferencia.valor.replace(".", "").replace(",", ".")),
    conta    :'transferencia',
    descricao: transferencia.origem + ' ->  ' + transferencia.destino,
    loja   : transferencia.origem.toUpperCase(),    
    data    : new Date(transferencia.date) ,
    status   : 'Recebido',
    carteira   : 'transferencia'
    }
})



return [transf ,desp, rec]
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

export const deleteDespesa = async (despesa: any) => {
  await prisma.despesas.delete({
    where: {
      id: despesa.id,
    },
  });
};


export const getContas = async()=>{
    return prisma.contas.findMany({
      orderBy: {
        conta: 'asc'
    },
    })
}

export const createConta = async (conta:any)=>{

const contal = conta.conta.toLowerCase()
const newConta = await prisma.contas.create({
    data:{
        conta: contal,
        etiqueta: contal.charAt(0).toUpperCase() + contal.slice(1)
    }
})
return newConta
}