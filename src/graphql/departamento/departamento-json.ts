export const getDepartamentos = () => {
  return {
    query: `query getDepartamentos($first: Int, $offset: Int) {
            departamentos(first: $first, offset: $offset) {
              id
              nome
              descricao
              status
            }
          }`
  };
};
