export async function criarPreCadastro(data: any) {
    const response = await fetch(
        `http://localhost:3333/pre-cadastro`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar pré-cadastro");
    }

    return result;
}