{
  description = "Compiler for the strictly language";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
       let  packageName = "tree-sitter-strictly";
            forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux"];
       in {
          packages = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};
                FLAGS = [
                  "-Isrc"
                  "-g"
                  "-O3"
                  "-fPIC"
                  "-fno-exceptions"
                  "-Wl,-z,relro,-z,now"
                ];
                name = "strictly.so";

            in {
              default = pkgs.stdenv.mkDerivation {
                name = "tree-sitter-strictly";
                src = ./.;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs ];
                buildPhase = ''
                  tree-sitter generate
                  $CC -c "src/parser.c" -o parser.o $FLAGS
                  $CXX -c "src/scanner.cc" -o scanner.o $FLAGS -shared -o ${name} *.o
                  chmod +x ${name}
                '';
                installPhase = ''
                  mkdir -p $out/lib
                  cp ${name} $out/lib/.
                '';
              };
            }
          );
          devShells = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};

            in {
              default =  pkgs.mkShell {
                buildInputs = [ pkgs.graphviz ];
              };
            }
          );
          checks = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};

            in {
              default = pkgs.stdenv.mkDerivation {
                name = "tree-sitter-strictly-test";
                src = ./.;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs self.packages.${system}.default ];
                buildPhase = ''
                  tree-sitter generate
                  TREE_SITTER_LIBDIR=${self.packages.${system}.default}/lib tree-sitter test
                '';
                installPhase = ''
                  touch $out
                '';
              };
            }
         );
      };
}

